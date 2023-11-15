import React, { useState } from 'react';
import { Flex, Collapse } from '@chakra-ui/react';
import { FormGroupHeading } from './FormGroupHeading';

interface Props {
  children: React.ReactNode;
  maxWidth?: number;
  title: React.ReactNode;
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  isOpen?: boolean;
  validIcon?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

export const FormGroup: React.FC<Props> = ({
  children,
  title,
  validIcon,
  icon,
  isOpen,
}) => {
  const [show, setShow] = useState(isOpen ?? true);

  const handleToggle = () => setShow(!show);

  return (
    <Flex
      direction='column'
      gap={['2', '6']}
      alignSelf='center'
      justifySelf='center'
      w={['100%', '100%', '60%']}
    >
      <FormGroupHeading
        icon={icon}
        title={title}
        validIcon={validIcon}
        onClick={handleToggle}
        chevronIcon={
          show ? String.fromCharCode(0x25b4) : String.fromCharCode(0x25be)
        }
      />
      <Collapse in={show}>{children}</Collapse>
    </Flex>
  );
};
