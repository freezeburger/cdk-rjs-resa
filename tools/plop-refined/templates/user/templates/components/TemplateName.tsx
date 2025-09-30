/* Global Imports */
import React, { FC } from 'react';

/* Application Level Imports */
import * as Hooks from '@/hooks';

/* Local Imports */
import { TemplateNameWrapper } from './TemplateName.styled';


interface TemplateNameProps { }


const TemplateName: FC<TemplateNameProps> = () => {

   // Hooks.useGloblaEvent('click',()=> console.log('click event'));

   return(
   <TemplateNameWrapper data-testid="TemplateName">
      TemplateName Component
   </TemplateNameWrapper>
   );

}

/**
 * USAGE: TemplateName description to complete.
 * @example
 * <TemplateName /> 
 */
const TemplateNameMemo = React.memo(TemplateName, (prevProps, nextProps) => {
   /*
   Compare props to prevent unnecessary re-renders
   return true if props are equal
   return false if props are not equal
   */
   console.log(prevProps, nextProps)
   return true;
});
TemplateNameMemo.displayName = 'TemplateName Memoized';

export default TemplateNameMemo;
