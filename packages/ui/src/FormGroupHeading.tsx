import React from 'react';
import {
  Flex,
  Icon,
  Heading,
  Spacer,
  useTheme,
  Button,
} from '@chakra-ui/react';

interface Props {
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  title: React.ReactNode;
  onClick?: () => void;
  chevronIcon?: string;
  tabIndex: number;
}

export const FormGroupHeading: React.FC<Props> = ({
  icon,
  title,
  onClick,
  chevronIcon,
}) => {
  const theme = useTheme();
  return (
    <Flex
      align='center'
      justify='start'
      mb={3}
      bg={theme.colors.gray[100]}
      p={2}
      borderRadius={8}
      w='100%'
      tabIndex={1}
      cursor='pointer'
    >
      {icon && <Icon width='20px' height='20px' mr={2} as={icon} />}
      <Heading fontSize='md' lineHeight='20px' fontWeight='700'>
        {title}
      </Heading>
      <Spacer />
      <Button onClick={onClick} tabIndex={1} variant='ghost' color='black'>
        {chevronIcon}
      </Button>
    </Flex>
  );
};
