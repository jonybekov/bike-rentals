import { InputWrapper, Button, Grid, Paper } from "@mantine/core";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../app/services/firebase";

import AsyncSelect from "react-select/async";
import { Options } from "react-select";
import { Controller, useForm } from "react-hook-form";
import { IBikeFilter, IBikeForm } from "../shared/types/bike";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DateRangePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useClient } from "react-supabase";
import { SimpleField } from "../shared/types/common";

const modelsRef = collection(db, "bike_models");

interface BikeFiltersProps {
  loading?: boolean;
  onSearch?: (values: IBikeFilter) => void;
}

export const BikeFilters = (props: BikeFiltersProps) => {
  const supabase = useClient();
  const {
    handleSubmit,
    formState: { isDirty },
    register,
    control,
  } = useForm<IBikeFilter>();

  const getBikeModels = async (
    inputValue: string,
    callback: (options: Options<any>) => void
  ) => {
    const { data } = await supabase.from<SimpleField>("models").select();

    return data ?? [];
  };

  const getColors = async () => {
    const { data } = await supabase.from<SimpleField>("colors").select();

    return data ?? [];
  };

  const getLocations = async () => {
    const { data } = await supabase.from<SimpleField>("locations").select();

    return data ?? [];
  };

  const onSubmit = (values: IBikeFilter) => {
    props.onSearch?.(values);
  };

  return (
    <Paper shadow="md" p="md" radius="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Grid.Col span={4}>
            <InputWrapper label="Model">
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <AsyncSelect<any>
                    isSearchable={false}
                    isClearable
                    cacheOptions
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    defaultOptions
                    loadOptions={getBikeModels}
                    {...field}
                  />
                )}
              />
            </InputWrapper>
            <InputWrapper label="Range" mt="md">
              <Controller
                name="period"
                control={control}
                render={({ field }) => (
                  <DateRangePicker
                    minDate={dayjs().toDate()}
                    placeholder="Pick dates range"
                    {...field}
                  />
                )}
              />
            </InputWrapper>
          </Grid.Col>
          <Grid.Col span={4}>
            <InputWrapper label="Color">
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <AsyncSelect<any>
                    isSearchable={false}
                    isClearable
                    cacheOptions
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    defaultOptions
                    loadOptions={getColors}
                    {...field}
                  />
                )}
              />
            </InputWrapper>
          </Grid.Col>
          <Grid.Col span={4}>
            <InputWrapper label="Location">
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <AsyncSelect<any>
                    isSearchable={false}
                    isClearable
                    cacheOptions
                    getOptionLabel={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    defaultOptions
                    loadOptions={getLocations}
                    {...field}
                  />
                )}
              />
            </InputWrapper>
          </Grid.Col>
        </Grid>

        <Button
          type="submit"
          mt="sm"
          loading={props.loading}
          variant="gradient"
          gradient={{ from: "teal", to: "lime", deg: 105 }}
        >
          Search
        </Button>
      </form>
    </Paper>
  );
};
