import { init } from "@instantdb/react";
import {CONFIG} from "../config"
// InstantDB App ID (real-time backend)
const APP_ID =CONFIG.INSTANT_APP_ID;

export const db = init({
  appId: APP_ID,
});

/*
InstantDB Mental Model (Schema):

reactions:
{
  id,
  imageId,
  emoji,
  userId,
  userName,
  timestamp,
  imageMetadata
}

comments:
{
  id,
  imageId,
  text,
  userId,
  userName,
  timestamp,
  imageMetadata
}
*/
