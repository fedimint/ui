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
import { FiEdit, FiTrash2, FiHexagon } from 'react-icons/fi';
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
        borderRadius='5px'
        borderWidth='1px'
        height='100%'
        width='100%'
        p='0'
      >
        <Table width='100%'>
          <Tbody>
            {Object.entries(services).map(([id, service]) => (
              <Tr key={`${type}-${id}`}>
                <Td width='0' pr='0' pl={['10px', '20px']}>
                  <FiHexagon fontSize='20px' />
                </Td>
                <Td pl='10px'>
                  <Flex gap={2} alignItems='center'>
                    <Link
                      display='inline-block'
                      href={`/${type}/${id}`}
                      _hover={{ textDecoration: 'underline' }}
                    >
                      <Text fontSize='md' wordBreak='break-word'>
                        {service.config.baseUrl}
                      </Text>
                    </Link>
                  </Flex>
                </Td>
                <Td width='0' pl='0' pr={['10px', '20px']}>
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
                      _hover={{ backgroundColor: 'red.100' }}
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
