import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  Link,
  useTheme,
} from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as TrashIcon } from '../assets/svgs/trash.svg';
import { ReactComponent as PlusIcon } from '../assets/svgs/plus.svg';

interface Props {
  metaFields: [string, string][];
  onChangeMetaFields: (value: [string, string][]) => void;
}

export const MetaFieldFormControl: React.FC<Props> = ({
  metaFields,
  onChangeMetaFields,
}) => {
  const theme = useTheme();

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
      <Flex direction='column' gap={3}>
        <FormHelperText mt={0} mb={2}>
          Additional configuration sent to fedimint clients. See{' '}
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
                placeholder={isDerived ? '' : 'Value'}
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
                  variant='ghost'
                  size='xs'
                  width={'42px'}
                  height={'42px'}
                  fontSize={12}
                  aria-label='Remove'
                  colorScheme='red'
                  color={theme.colors.gray[300]}
                  _hover={{ color: theme.colors.red[500] }}
                  icon={<TrashIcon height={20} />}
                  onClick={() => handleRemoveMetaField(idx)}
                />
              )}
            </Flex>
          );
        })}
        <Button
          leftIcon={<PlusIcon height={20} width={20} />}
          variant='outline'
          onClick={handleAddMetaField}
        >
          Add another
        </Button>
      </Flex>
    </FormControl>
  );
};
