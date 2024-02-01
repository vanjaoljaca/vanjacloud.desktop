import React from 'react';
import { Editor, rootCtx } from '@milkdown/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { commonmark } from '@milkdown/preset-commonmark';

const MilkdownEditor: React.FC = () => {
  const { get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
      })
      .use(commonmark),
  );

  return <Milkdown />;
};

const MyEditor: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
};

export default MyEditor