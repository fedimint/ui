import React, { useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Text,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { ServiceType, ServiceConfig } from '../types';

type ServiceMenuProps = {
  guardians: Record<string, ServiceConfig>;
  gateways: Record<string, ServiceConfig>;
  activeServiceId: string | undefined;
};

export const ServiceMenu: React.FC<ServiceMenuProps> = ({
  guardians,
  gateways,
  activeServiceId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleServiceSelect = (type: ServiceType, id: string) => {
    navigate(`/${type}/${id}`);
    setIsOpen(false);
  };

  const renderServiceList = (
    services: Record<string, ServiceConfig>,
    type: ServiceType
  ) => (
    <>
      <MenuItem
        as='div'
        fontWeight='bold'
        _hover={{ background: 'none' }}
        cursor='default'
      >
        {type === 'guardian' ? 'Guardians' : 'Gateways'}
      </MenuItem>
      {Object.entries(services).map(([id, service]) => (
        <MenuItem
          key={id}
          onClick={() =>
            `${type}/${id}` !== activeServiceId && handleServiceSelect(type, id)
          }
          pl={4}
          bg={`${type}/${id}` === activeServiceId ? 'blue.50' : 'transparent'}
          _hover={{
            bg: `${type}/${id}` === activeServiceId ? 'blue.50' : 'gray.100',
          }}
          cursor={`${type}/${id}` === activeServiceId ? 'default' : 'pointer'}
        >
          <Text fontSize='sm'>{service.config.baseUrl}</Text>
        </MenuItem>
      ))}
    </>
  );

  return (
    <Menu
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement='bottom-end'
      closeOnBlur={true}
    >
      <MenuButton
        as={Button}
        leftIcon={<FiMenu />}
        size='md'
        variant='outline'
        onClick={() => setIsOpen(!isOpen)}
      />
      <MenuList>
        {Object.keys(guardians).length > 0 &&
          renderServiceList(guardians, 'guardian')}
        {Object.keys(gateways).length > 0 &&
          renderServiceList(gateways, 'gateway')}
      </MenuList>
    </Menu>
  );
};
