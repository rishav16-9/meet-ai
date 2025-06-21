import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface Props {
  seed: string;
  variant: "botttsneutral" | "initials";
}

export const generateAvatar = ({ seed, variant }: Props) => {
  let avatar;
  if (variant === "botttsneutral") {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  }
  return avatar.toDataUri();
};
