'use client';
import { useState } from "react";
import { JsonForms } from '@jsonforms/react';
import schema from './schema.json';
import uischema from './uischema.json';
import userdata from './data.json';

import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';

//import { i } from "react-router/dist/development/route-data-aSUFWnQ6";

export default function Page(): React.JSX.Element {
  const [data, setData] = useState(userdata);
  
    return (
      <div>
        <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => setData(data)}
      />
      </div>
    );
  };