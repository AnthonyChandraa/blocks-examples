import React from 'react';

import * as LR from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-regular.min.css?url';

LR.registerBlocks(LR);

export default function RegularView() {
  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey={import.meta.env.VITE_UPLOADCARE_PUB_KEY}
        sourceList="local, url, camera, dropbox"
      ></lr-config>
      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src={blocksStyles}
      ></lr-file-uploader-regular>
    </div>
  );
}
