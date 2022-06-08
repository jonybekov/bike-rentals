import { InputWrapper, Button, Grid, TextInput } from "@mantine/core";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../app/services/firebase";

import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { IUserForm, UserRole } from "../../../shared/types/user";

interface UserFormProps {
  onSubmit?: (values: IUserForm) => Promise<void>;
  initialValues?: IUserForm;
}

export function UserForm(props: UserFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    formState: { isDirty },
    control,
  } = useForm<IUserForm>({
    defaultValues: props.initialValues,
  });

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
            {...register("displayName", { required: true })}
          />
          <TextInput
            required
            label="Email"
            {...register("email", { required: true })}
          />
          <InputWrapper label="Role" required mb="sm">
            <Controller
              name="role"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select<any>
                  isSearchable={false}
                  isClearable
                  options={[
                    {
                      value: UserRole.Manager,
                      label: "Manager",
                    },
                    {
                      value: UserRole.User,
                      label: "User",
                    },
                  ]}
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
