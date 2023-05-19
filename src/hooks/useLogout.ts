import { useDispatch } from "react-redux";

import { useLazyLogoutQuery } from "@/app/services/auth";
import { resetChannels } from "@/app/slices/channels";
import { resetFootprint } from "@/app/slices/footprint";
import { resetMessage } from "@/app/slices/message";
import { resetChannelMsg } from "@/app/slices/message.channel";
import { resetFileMessage } from "@/app/slices/message.file";
import { resetReactionMessage } from "@/app/slices/message.reaction";
import { resetUserMsg } from "@/app/slices/message.user";
import { resetUsers } from "@/app/slices/users";

export default function useLogout() {
  const dispatch = useDispatch();
  const [logout, { isLoading, isSuccess }] = useLazyLogoutQuery();
  const clearLocalData = () => {
    dispatch(resetFootprint());
    dispatch(resetChannelMsg());
    dispatch(resetUserMsg());
    dispatch(resetChannels());
    dispatch(resetUsers());
    dispatch(resetMessage());
    dispatch(resetReactionMessage());
    dispatch(resetFileMessage());
  };

  return { clearLocalData, logout, exited: isSuccess, exiting: isLoading };
}
