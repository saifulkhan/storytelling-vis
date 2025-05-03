import React, { useState } from 'react';

// local import
import * as msb from '../..';
// import from npm library
// import * as msb from 'meta-storyboard';

const TestActionPropertiesTablePage = () => {
  const [data, setData] = useState<Record<string, any>>({
    title: 'Example Text',
    message: 'Lorem ipsum dolor sit amet',
    backgroundColor: '#0000FF',
    width: 100,
  });

  return (
    <>
      <msb.ActionPropertiesTable data={data} setData={setData} />
    </>
  );
};

export default TestActionPropertiesTablePage;
