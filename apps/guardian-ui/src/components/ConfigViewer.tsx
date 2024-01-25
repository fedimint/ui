import React from 'react';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import { githubLight } from '@uiw/codemirror-theme-github';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { ClientConfig } from '@fedimint/types';
import { useTranslation } from '@fedimint/utils';

interface ConfigViewerProps {
  config: ClientConfig | undefined;
}

export const ConfigViewer: React.FC<ConfigViewerProps> = ({ config }) => {
  const { t } = useTranslation();
  return (
    <Card flex='1'>
      <CardHeader>
        <Text size='lg' fontWeight='600'>
          {t('federation-dashboard.config.label')}
        </Text>
      </CardHeader>
      <CardBody>
        <CodeMirror
          value={JSON.stringify(config, null, 2)}
          theme={githubLight}
          extensions={[json()]}
          basicSetup={{ autocompletion: true }}
          minWidth={'500px'}
          minHeight={'500px'}
          readOnly
        />
      </CardBody>
    </Card>
  );
};
