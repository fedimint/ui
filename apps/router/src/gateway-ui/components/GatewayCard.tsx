import React from 'react';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';

export interface GatewayCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const GatewayCard = React.memo(function GatewayCard({
  title,
  description,
  children,
}: GatewayCardProps) {
  return (
    <Card w='100%' maxWidth='100%' border='none'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {title}
        </Text>
        {description && (
          <Text variant='secondary' size='sm'>
            {description}
          </Text>
        )}
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
});
