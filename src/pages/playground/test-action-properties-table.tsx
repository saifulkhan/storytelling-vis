import React, { useState } from 'react';

// local import
import * as msb from '../../msb';
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
    <div>
      <msb.ActionPropertiesTable data={data} setData={setData} />
    </div>
  );
};

export default TestActionPropertiesTablePage;
