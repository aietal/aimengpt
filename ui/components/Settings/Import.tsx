import { IconFileImport } from '@tabler/icons-react';
import { FC } from 'react';
import { toast } from 'react-hot-toast';

import { useTranslation } from 'next-i18next';

import { SupportedExportFormats } from '@/types/export';

import { SidebarButton } from '../Sidebar/SidebarButton';

import axios from 'axios';

interface Props {
  onImport: (data: SupportedExportFormats) => void;
}

export const Import: FC<Props> = ({ onImport }) => {
  const { t } = useTranslation('sidebar');

  return (
    <>
      <input
        id="import-file"
        className="sr-only"
        tabIndex={-1}
        type="file"
        accept=".pdf"
        onChange={async (e) => {
          if (!e.target.files?.length) return;

          const file = e.target.files[0];
          const formData = new FormData();
          formData.append('pdf', file);

          axios
            .post('/api/inject-documents', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              toast.success('File uploaded successfully!');
            })
            .catch((error) => {
              console.error('Error uploading file:', error);
            });
        }}
      />

      <SidebarButton
        text={t('Upload file')}
        icon={<IconFileImport size={18} />}
        onClick={() => {
          const importFile = document.querySelector(
            '#import-file',
          ) as HTMLInputElement;
          if (importFile) {
            importFile.click();
          }
        }}
      />
    </>
  );
};
