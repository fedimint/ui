import React, { useEffect } from 'react';
import { Button, Flex, Textarea } from '@chakra-ui/react';
import { useTranslation } from '@fedimint/utils';
import { getEnv } from '../utils/env';

interface Props {
  next(): void;
}

export const TermsOfService: React.FC<Props> = ({ next }) => {
  const { t } = useTranslation();
  const tos = getEnv().TOS;

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
