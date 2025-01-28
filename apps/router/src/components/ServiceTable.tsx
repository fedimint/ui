import React from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  Table,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Gateway, Guardian } from '../context/AppContext';

interface ServiceTableProps {
  services: Record<string, Guardian | Gateway>;
  type: 'guardian' | 'gateway';
  heading: string;
  setEditingService: (service: {
    type: 'guardian' | 'gateway';
    id: string;
  }) => void;
  setRemovingService: (service: {
    type: 'guardian' | 'gateway';
    id: string;
  }) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  type,
  heading,
  setEditingService,
  setRemovingService,
}) => {
  return (
    <>
      <Heading fontSize='lg'>{heading}</Heading>
      <Box
        p='4'
        borderRadius='5px'
        borderWidth='1px'
        marginBottom='20px'
        height='100%'
        width='100%'
      >
        <Table>
          <Tbody>
            {Object.entries(services).map(([id, service]) => (
              <Tr key={`${type}-${id}`}>
                <Td>
                  <Flex gap={2} alignItems='center'>
                    <Link
                      href={`/${type}/${id}`}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      <Text fontSize='md'>{service.config.baseUrl}</Text>
                    </Link>
                  </Flex>
                </Td>
                <Td>
                  <Flex justifyContent='flex-end' gap={3} alignItems='center'>
                    <IconButton
                      aria-label={`Edit ${type}`}
                      icon={<FiEdit />}
                      size='md'
                      variant='outline'
                      onClick={() => setEditingService({ type, id })}
                    />
                    <IconButton
                      aria-label={`Delete ${type}`}
                      icon={<FiTrash2 />}
                      size='md'
                      colorScheme='red'
                      variant='outline'
                      onClick={() => setRemovingService({ type, id })}
                    />
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};
