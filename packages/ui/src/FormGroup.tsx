import React, { useState } from 'react';
import { Flex, Collapse } from '@chakra-ui/react';
import { FormGroupHeading } from './FormGroupHeading';

interface Props {
  children: React.ReactNode;
  maxWidth?: number;
  title: React.ReactNode;
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  isOpen?: boolean;
}

export const FormGroup: React.FC<Props> = ({
  children,
  title,
  icon,
  isOpen,
}) => {
  const [open, setOpen] = useState(isOpen ?? true);

  return (
    <Flex
      direction='column'
      gap={['2', '6']}
      alignSelf='center'
      justifySelf='center'
      w={['100%', '100%', '60%']}
      fontSize='sm'
    >
      <FormGroupHeading
        icon={icon}
        title={title}
        onClick={() => setOpen(!open)}
        chevronIcon={
          open
            ? String.fromCharCode(0x25b4)
            : String.fromCharCode(0x25be) + ' Show Fields'
        }
      />
      <Collapse in={open}>{children}</Collapse>
    </Flex>
  );
};
