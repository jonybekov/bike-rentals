import { InputWrapper, Button, Grid } from "@mantine/core";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../app/services/firebase";

import AsyncSelect from "react-select/async";
import { Options } from "react-select";
import { Controller, useForm } from "react-hook-form";
import { IBikeForm } from "../../../shared/types/bike";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const modelsRef = collection(db, "bike_models");

interface BikeFormProps {
  onSubmit?: (values: IBikeForm) => Promise<void>;
  initialValues?: IBikeForm;
}

export function BikeForm(props: BikeFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    formState: { isDirty },
    control,
  } = useForm<IBikeForm>({
    defaultValues: props.initialValues,
  });

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

  const onSubmit = (values: IBikeForm) => {
    setLoading(true);

    props.onSubmit?.(values).then(() => {
      setLoading(false);
    });
  };

  return (
    <Grid>
      <Grid.Col span={12} md={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputWrapper label="Model" required mb="sm">
            <Controller
              name="model"
              control={control}
              rules={{ required: true }}
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
          <InputWrapper label="Color" required mb="sm">
            <Controller
              name="color"
              control={control}
              rules={{ required: true }}
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
          <InputWrapper label="Location" required>
            <Controller
              name="location"
              control={control}
              rules={{ required: true }}
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
          {/* <InputWrapper label="Photo">
        <Input type="file" {...form.getInputProps("image")} />
      </InputWrapper> */}

          <Button
            fullWidth
            type="submit"
            mt="lg"
            size="md"
            loading={loading}
            disabled={!isDirty}
          >
            Save
          </Button>
        </form>
      </Grid.Col>
    </Grid>
  );
}