import React from 'react';
import { useParams } from 'react-router-dom';
import ImportRecord from '../components/ImportRecord';

const ImportRoute = () => {
  const { id } = useParams();
  return <ImportRecord id={id} />;
};

export default ImportRoute;
