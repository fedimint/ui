import React from 'react';
import { Flex } from '@chakra-ui/react';
import { githubLight } from '@uiw/codemirror-theme-github';
import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { ClientConfig } from '@fedimint/types';

interface MetaViewerProps {
  config: ClientConfig | undefined;
}

export const MetaViewer: React.FC<MetaViewerProps> = ({ config }) => {
  return (
    <Flex
      direction='column'
      boxShadow={'md'}
      p={4}
      borderStyle={'solid'}
      borderWidth={1}
      rounded={'lg'}
    >
      <CodeMirror
        value={JSON.stringify(config, null, 2)}
        theme={githubLight}
        extensions={[json()]}
        basicSetup={{ autocompletion: true }}
        minWidth={'500px'}
        minHeight={'500px'}
        readOnly
      />
    </Flex>
  );
};
