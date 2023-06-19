import React from 'react';
import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { ReactComponent as CheckIcon } from '../assets/svgs/white-check.svg';
import { StepState } from '../setup/types';

interface StepProps {
  text: string;
  state: StepState;
  margin?: string;
}

const Step: React.FC<StepProps> = ({ text, state, margin = '-48px' }) => {
  const colorState = (
    inActiveColor: string,
    activeColor: string,
    completedColor: string
  ) =>
    state === StepState.InActive
      ? inActiveColor
      : state === StepState.Active
      ? activeColor
      : completedColor;

  return (
    <Flex
      w='100%'
      flexDir='column'
      alignItems='flex-end'
      h='72px'
      justifyContent='space-between'
    >
      <Flex alignItems='center' h='100%' w='100%'>
        <Box
          w='100%'
          h='2px'
          bgColor={state === StepState.InActive ? '#EAECF0' : '#1570ef'}
        ></Box>
        <Flex>
          <Center
            borderRadius={'50%'}
            h={state === StepState.Active ? '36px' : '24px'}
            w={state === StepState.Active ? '36px' : '24px'}
            bgColor={colorState('transparent', '#EFF8FF', 'transparent')}
          >
            <Center
              borderRadius='50%'
              h='24px'
              w='24px'
              bgColor={colorState('#F2F4F7', '#1570ef', '#1570ef')}
            >
              {state === StepState.Completed ? (
                <CheckIcon />
              ) : (
                <Center
                  borderRadius='50%'
                  h='8px'
                  w='8px'
                  bgColor='white'
                ></Center>
              )}
            </Center>
          </Center>
        </Flex>
      </Flex>
      <Text
        textTransform='capitalize'
        fontWeight='600'
        fontSize='14px'
        color={colorState('#344054', '#1570ef', '#1570ef')}
        whiteSpace='nowrap'
        mr={margin}
      >
        {text}
      </Text>
    </Flex>
  );
};

const InitialStep: React.FC<Pick<StepProps, 'state'>> = ({ state }) => {
  return (
    <Flex
      flexDir='column'
      alignItems='flex-end'
      h='72px'
      justifyContent='space-between'
    >
      <Flex alignItems='center' h='100%'>
        <Center
          borderRadius='50%'
          h={state === StepState.Active ? '36px' : '24px'}
          w={state === StepState.Active ? '36px' : '24px'}
          bgColor='#EFF8FF'
        >
          <Center borderRadius='50%' h='24px' w='24px' bgColor='#1570EF'>
            {state === StepState.Completed ? (
              <CheckIcon />
            ) : (
              <Center
                borderRadius='50%'
                h='8px'
                w='8px'
                bgColor='white'
              ></Center>
            )}
          </Center>
        </Center>
      </Flex>
      <Text
        textTransform='capitalize'
        fontWeight='600'
        fontSize='14px'
        color={state === StepState.InActive ? '#344054' : '#1570ef'}
        whiteSpace='nowrap'
        mr='-42px'
      >
        Federation details
      </Text>
    </Flex>
  );
};

interface SetupProgressProps {
  setupProgress: number;
  isHost: boolean;
}

export const SetupProgress: React.FC<SetupProgressProps> = ({
  setupProgress,
  isHost,
}) => {
  return (
    <Flex justifyContent='center' alignItems='center' w='100%'>
      <Flex w='100%' justifyContent='space-between'>
        <InitialStep
          state={setupProgress === 1 ? StepState.Active : StepState.Completed}
        />
        <Step
          text={isHost ? 'Invite Guardians' : 'Confirm Info'}
          state={
            setupProgress === 2
              ? StepState.Active
              : setupProgress > 2
              ? StepState.Completed
              : StepState.InActive
          }
          margin={isHost ? '-48px' : '-32px'}
        />
        <Step
          text='Verify Guardians'
          state={
            setupProgress === 4
              ? StepState.Active
              : setupProgress > 4
              ? StepState.Completed
              : StepState.InActive
          }
        />
        <Step
          text='Done '
          state={setupProgress === 5 ? StepState.Completed : StepState.InActive}
          margin='-8px'
        />
      </Flex>
    </Flex>
  );
};
