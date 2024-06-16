/**
 * UrlWidget component.
 * @module components/manage/Widgets/UrlWidget
 */

import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { UniversalLink } from '@plone/volto/components';
import VoltoUrlWidget from '@plone/volto/components/manage/Widgets/UrlWidget';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';

export const InternalUrlWidget = (props) => {
  const { value } = props;

  return (
    <VoltoUrlWidget
      {...props}
      title={
        value ? (
          <UniversalLink href={value} openLinkInNewTab={true}>
            {props.title}
          </UniversalLink>
        ) : (
          props.title
        )
      }
    />
  );
};

export default compose(withRouter, withObjectBrowser)(InternalUrlWidget);
