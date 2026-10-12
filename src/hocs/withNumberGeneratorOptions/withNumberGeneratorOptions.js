import { useNumberGeneratorOptions } from '../../common/hooks';

const withNumberGeneratorOptions = (WrappedComponent) => {
  return (props) => {
    const { data: numberGeneratorData } = useNumberGeneratorOptions();

    return (
      <WrappedComponent
        {...props}
        numberGeneratorData={numberGeneratorData}
      />
    );
  };
};

export default withNumberGeneratorOptions;
