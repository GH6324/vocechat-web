import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { User } from "@/types/user";
import { formatBytes, fromNowTime, getFileIcon } from "@/utils";
import IconClose from "@/assets/icons/close.circle.svg";
import IconDownload from "@/assets/icons/download.svg";
import IconInfo from "@/assets/icons/info.svg";
import Progress from "./Progress";

const ExpireTip = () => {
  const { t } = useTranslation("chat");
  return (
    <span className="text-red-500 text-xs whitespace-nowrap flex items-center gap-1">
      <IconInfo className="stroke-gray-600 w-6 h-6" />
    </span>
  );
};

type Props = {
  content: string;
  sending: boolean;
  content_type: string;
  name: string;
  progress: number;
  size: number;
  created_at: number;
  from_user: User;
  handleCancel: () => void;
};

const OtherFileMessage = ({
  content,
  sending,
  content_type,
  name,
  progress,
  size,
  created_at,
  from_user,
  handleCancel
}: Props) => {
  const [error, setError] = useState(false);
  const icon = getFileIcon(content_type, name, `w-9 shrink-0 h-auto ${error ? "grayscale" : ""}`);
  useEffect(() => {
    if (content) {
      fetch(content)
        .then((resp) => {
          console.log("fetch", resp.status);
          if (resp.status >= 400) {
            setError(true);
          }
        })
        .catch((error) => {
          console.log("fetch error", error);
          setError(true);
        });
    }
  }, [content]);

  return (
    <div
      className={clsx(
        `bg-stone-100 dark:bg-stone-900 border box-border md:w-96 rounded-md border-gray-300 dark:border-gray-500`,
        sending && "opacity-90"
        // error ? "border-red-100 dark:border-red-900/50" : "border-gray-300 dark:border-gray-500"
      )}
    >
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        {icon}
        <div className="flex flex-col gap-1 w-full overflow-hidden">
          <span
            className={clsx(
              "font-semibold text-sm truncate text-gray-800 dark:text-gray-100"
              // error ? "text-red-500" : "text-gray-800 dark:text-gray-100"
            )}
          >
            {error ? "File not Found" : name}
          </span>
          <span className="hidden md:flex whitespace-nowrap text-xs text-gray-500 dark:text-gray-300 gap-4">
            {sending ? (
              <Progress value={progress} width={"80%"} />
            ) : error ? (
              <strong>File expired or deleted</strong>
            ) : (
              <>
                <strong>{formatBytes(size)}</strong>
                <strong>{fromNowTime(created_at)}</strong>
                {from_user && (
                  <strong>
                    by <strong className="font-bold">{from_user.name}</strong>
                  </strong>
                )}
              </>
            )}
          </span>
        </div>
        {sending ? (
          <IconClose className="cursor-pointer" onClick={handleCancel} />
        ) : error ? (
          <ExpireTip />
        ) : (
          <a
            className="hidden md:block whitespace-nowrap"
            download={name}
            href={`${content}&download=true`}
          >
            <IconDownload className="fill-gray-500 dark:fill-gray-400" />
          </a>
        )}
      </div>
    </div>
  );
};

export default OtherFileMessage;
export { ExpireTip };
