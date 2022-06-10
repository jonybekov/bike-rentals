import { InputWrapper, Button, Grid, TextInput } from "@mantine/core";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../app/services/firebase";

import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { IUserForm, UserRole } from "../../../shared/types/user";
import { useClient } from "react-supabase";
import AsyncSelect from "react-select/async";

interface UserFormProps {
  onSubmit?: (values: IUserForm) => Promise<void>;
  initialValues?: IUserForm;
  mode?: "create" | "edit";
}

export function UserForm({ mode = "create", ...props }: UserFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { isDirty },
    control,
  } = useForm<IUserForm>({
    defaultValues: props.initialValues,
  });

  const supabase = useClient();

  const getRoles = async () => {
    const { data } = await supabase.from("roles").select("*");

    return data ?? [];
  };

  const onSubmit = (values: IUserForm) => {
    setLoading(true);

    props.onSubmit?.(values).then(() => {
      setLoading(false);
    });
  };

  return (
    <Grid>
      <Grid.Col span={12} md={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            required
            label="Display Name"
            {...register("display_name", { required: true })}
          />
          <TextInput
            disabled={mode === "edit"}
            required
            label="Email"
            {...register("email", { required: true })}
          />
          {mode === "create" && (
            <TextInput
              required
              label="Password"
              {...register("password", { required: true })}
            />
          )}
          <InputWrapper label="Role" required mb="sm">
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <AsyncSelect<any>
                  isSearchable={false}
                  cacheOptions
                  defaultOptions
                  filterOption={(item) => item.label !== "admin"}
                  getOptionLabel={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  isClearable
                  loadOptions={getRoles}
                  {...field}
                />
              )}
            />
          </InputWrapper>

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
