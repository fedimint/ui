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
  onKeyDown?: (e: React.KeyboardEvent) => void;
  chevronIcon?: string;
}

export const FormGroupHeading: React.FC<Props> = ({
  icon,
  title,
  onClick,
  chevronIcon,
}) => {
  const theme = useTheme();
  return (
    <Button
      mb={3}
      color={theme.colors.white[100]}
      p={2}
      borderRadius={8}
      w='100%'
      tabIndex={0}
      role='button'
      onClick={onClick}
      cursor='pointer'
    >
      {icon && <Icon width='20px' height='20px' mr={2} as={icon} />}
      <Heading fontSize='md' lineHeight='20px' fontWeight='700'>
        {title}
      </Heading>
      <Spacer />
      {chevronIcon}
    </Button>
  );
};
