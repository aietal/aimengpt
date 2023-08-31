import { FC, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { useTranslation } from 'next-i18next';

import { Plugin, PluginList } from '@/types/plugin';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useChatStore } from '@/context/chat.store';

interface Props {
  plugin: Plugin | null;
  onPluginChange: (plugin: Plugin) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLSelectElement>) => void;
}

export const PluginSelect: FC<Props> = ({
  plugin,
  onPluginChange,
  onKeyDown,
}) => {
  const { t } = useTranslation('chat');

  const setChatMode = useChatStore((s) => s.setChatMode);
  const chatMode = useChatStore((s) => s.chatMode);

  const selectChatMode = (newChatMode: string) => {
    const chatModeName =
      newChatMode === 'chat' ? 'Regular chat' : 'Uploaded documents chat';

    setChatMode(newChatMode);

    toast.success(chatModeName + ' selected');
  };

  const selectRef = useRef<HTMLSelectElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    const selectElement = selectRef.current;
    const optionCount = selectElement?.options.length || 0;

    if (e.key === '/' && e.metaKey) {
      e.preventDefault();
      if (selectElement) {
        selectElement.selectedIndex =
          (selectElement.selectedIndex + 1) % optionCount;
        selectElement.dispatchEvent(new Event('change'));
      }
    } else if (e.key === '/' && e.shiftKey && e.metaKey) {
      e.preventDefault();
      if (selectElement) {
        selectElement.selectedIndex =
          (selectElement.selectedIndex - 1 + optionCount) % optionCount;
        selectElement.dispatchEvent(new Event('change'));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectElement) {
        selectElement.dispatchEvent(new Event('change'));
      }

      onPluginChange(
        PluginList.find(
          (plugin) =>
            plugin.name === selectElement?.selectedOptions[0].innerText,
        ) as Plugin,
      );
    } else {
      onKeyDown(e);
    }
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="mb-1 w-full bg-transparent pr-2 text-neutral-900 dark:text-white">
        <Select
          value={chatMode}
          onValueChange={(value) => selectChatMode(value)}
        >
          <SelectTrigger className="max-w-max">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chat">Regular Chat</SelectItem>
            <SelectItem value="rag">Uploaded Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

{
  /* <select
ref={selectRef}
className="w-full cursor-pointer bg-transparent p-2"
placeholder={t('Select a chat mode') || ''}
value={chatMode}
onChange={(e) => selectChatMode(e.target.value)}
onKeyDown={(e) => {
  handleKeyDown(e);
}}
>
<option
  key="chat"
  value="chat"
  className="dark:bg-[#1d1c21] dark:text-white"
>
  Regular Chat
</option>
<option
  key="rag"
  value="rag"
  className="dark:bg-[#1d1c21] dark:text-white"
>
  Documentation Chat
</option>
</select> */
}
