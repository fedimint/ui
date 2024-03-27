import React, { useEffect } from 'react';
import { Button, Flex, Textarea } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';

interface Props {
  next(): void;
  tos?: string;
}

export const TermsOfService: React.FC<Props> = ({ next, tos }) => {
  const { t } = useTranslation();

  // If this was mistakenly rendered with no ToS, just instantly agree and continue.
  useEffect(() => {
    if (!tos) next();
  }, [tos, next]);

  return (
    <Flex direction='column' gap={4} maxWidth={660}>
      <Textarea value={tos} rows={14} readOnly />
      <Button onClick={next}>{t('terms-of-service.agree-and-continue')}</Button>
    </Flex>
  );
};
