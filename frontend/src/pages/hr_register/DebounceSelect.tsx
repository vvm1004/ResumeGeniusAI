import React, { useMemo } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";

interface DebounceSelectProps<ValueType = any> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  value?: ValueType[];
  onChange?: (value: ValueType[]) => void;
}

const DebounceSelect = <ValueType extends { label: string; value: string }>({
  fetchOptions,
  debounceTimeout = 300,
  ...props
}: DebounceSelectProps<ValueType>) => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = async (value: string) => {
      setFetching(true);
      const newOptions = await fetchOptions(value);
      setOptions(newOptions);
      setFetching(false);
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
};

export default DebounceSelect;
