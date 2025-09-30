import React, { Suspense } from 'react';

const LazyTemplateName =  React.lazy(() => import('./TemplateName'));

const TemplateName = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyTemplateName {...props} />
  </Suspense>
);
TemplateName.displayName = 'TemplateName Lazy Loaded';

export default TemplateName;
