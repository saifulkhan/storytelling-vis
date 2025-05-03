import React, { useState } from 'react';

// local import
import * as msb from '../..';
// import from npm library
// import * as msb from 'meta-storyboard';

const TestFeaturePropertiesTablePage = () => {
  const [data, setData] = useState<Record<string, any>>({
    le: 5,
    gt: 2,
    some_key: 'some_value',
  });

  return (
    <>
      <msb.FeaturePropertiesTable data={data} setData={setData} />
    </>
  );
};

export default TestFeaturePropertiesTablePage;
