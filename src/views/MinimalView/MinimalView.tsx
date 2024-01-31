import React from 'react';

import * as LR from '@uploadcare/blocks';
import blocksStyles from '@uploadcare/blocks/web/lr-file-uploader-minimal.min.css?url';

LR.registerBlocks(LR);

export default function MinimalView() {
  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey={import.meta.env.VITE_UPLOADCARE_PUB_KEY}
      ></lr-config>
      <lr-file-uploader-minimal
        ctx-name="my-uploader"
        css-src={blocksStyles}
      ></lr-file-uploader-minimal>
    </div>
  );
}
