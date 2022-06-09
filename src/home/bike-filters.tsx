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

const modelsRef = collection(db, "bike_models");

interface BikeFiltersProps {
  loading?: boolean;
  onSearch?: (values: IBikeFilter) => void;
}

export const BikeFilters = (props: BikeFiltersProps) => {
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
    // const q = query(modelsRef, where("name", "<=", inputValue));
    const querySnapshot = await getDocs(modelsRef);
    const models = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return models;
  };

  const getColors = async () => {
    const querySnapshot = await getDocs(collection(db, "colors"));

    const allColors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return allColors;
  };

  const getLocations = async () => {
    const querySnapshot = await getDocs(collection(db, "locations"));

    const allColors = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return allColors;
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
