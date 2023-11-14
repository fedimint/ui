import React from 'react';
import { Flex, Icon, Heading, useTheme } from '@chakra-ui/react';

export const FormGroupHeading: React.FC<{
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  title: React.ReactNode;
}> = ({ icon, title }) => {
  const theme = useTheme();
  return (
    <Flex
      align='center'
      justify='start'
      mb={icon ? -3 : 3}
      bg={theme.colors.gray[100]}
      p={2}
      borderRadius={8}
      w='100%'
    >
      {icon && <Icon width='20px' height='20px' mr={2} as={icon} />}
      <Heading fontSize='md' lineHeight='20px' fontWeight='700'>
        {title}
      </Heading>
    </Flex>
  );
};
