import {
  Button,
  Collapse,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  useTheme,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ReactComponent as TrashIcon } from '../assets/svgs/trash.svg';

interface Props {
  metaFields: [string, string][];
  onChangeMetaFields: (value: [string, string][]) => void;
}

export const MetaFieldFormControl: React.FC<Props> = ({
  metaFields,
  onChangeMetaFields,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const derivedMetaKeys = ['federation_name'];

  const handleChangeMetaField = (key: string, value: string, index: number) => {
    const newFields = [...metaFields];
    newFields[index] = [key, value];
    onChangeMetaFields(newFields);
  };

  const handleRemoveMetaField = (idx: number) => {
    onChangeMetaFields(metaFields.filter((_, i) => i !== idx));
  };

  const handleAddMetaField = () => {
    onChangeMetaFields([...metaFields, ['', '']]);
  };

  return (
    <FormControl>
      <FormLabel onClick={() => setIsOpen((s) => !s)} cursor='pointer'>
        Meta fields
      </FormLabel>
      <Collapse in={isOpen}>
        <Flex direction='column' gap={3}>
          <FormHelperText mt={0} mb={2}>
            Configuration sent to federation clients. See{' '}
            <Link
              href='https://github.com/fedimint/fedimint/blob/master/docs/meta_fields/README.md'
              target='_blank'
              rel='noopener noreferrer'
              color={theme.colors.blue[600]}
            >
              documentation
            </Link>{' '}
            for more information.
          </FormHelperText>
          {metaFields.map(([key, value], idx) => {
            const isDerived = derivedMetaKeys.includes(key);
            return (
              <Flex gap={3} key={idx}>
                <Input
                  placeholder='Key'
                  value={key}
                  disabled={isDerived}
                  onChange={(ev) =>
                    handleChangeMetaField(ev.target.value, value, idx)
                  }
                />
                <Input
                  placeholder='Value'
                  value={value}
                  disabled={isDerived}
                  onChange={(ev) =>
                    handleChangeMetaField(key, ev.target.value, idx)
                  }
                />
                {!isDerived && (
                  <IconButton
                    position='absolute'
                    left='100%'
                    transform='translate(8px, 4px)'
                    variant='ghost'
                    colorScheme='red'
                    size='xs'
                    aria-label='Remove'
                    icon={<TrashIcon />}
                    onClick={() => handleRemoveMetaField(idx)}
                  />
                )}
              </Flex>
            );
          })}
          <Button variant='outline' onClick={handleAddMetaField}>
            Add another
          </Button>
        </Flex>
      </Collapse>
    </FormControl>
  );
};
