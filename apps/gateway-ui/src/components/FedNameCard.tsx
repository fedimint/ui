import React from 'react';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';

export interface FedNameCardProps {
  title: string;
  federationName?: string;
  children: React.ReactNode;
}

export const FedNameCard = React.memo(function FedNameCard({
  title,
  federationName,
  children,
}: FedNameCardProps) {
  return (
    <Card w='100%' maxWidth='100%'>
      <CardHeader>
        <Text variant='secondary' size='sm'>
          {title}
        </Text>
        {federationName && (
          <Text size='xl' fontWeight='600'>
            {federationName}
          </Text>
        )}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
});
