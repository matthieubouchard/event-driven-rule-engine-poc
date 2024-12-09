import {useForm} from "@conform-to/react";

import {parseWithZod} from "@conform-to/zod";

import {z} from "zod";

const todosSchema = z.object({
  title: z.string(),

  tasks: z.array(z.string()),
});

export default function Tasks() {
  const [form, fields] = useForm({
    onValidate({formData}) {
      return parseWithZod(formData, {schema: todosSchema});
    },

    shouldValidate: "onBlur",
  });

  const tasks = fields.tasks.getFieldList();

  return (
    <form id={form.id} onSubmit={form.onSubmit}>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.key}>
            <input name={task.name} />

            <button
              {...form.reorder.getButtonProps({
                name: fields.tasks.name,

                from: index,

                to: 0,
              })}
            >
              Move to top
            </button>

            <button
              {...form.remove.getButtonProps({
                name: fields.tasks.name,

                index,
              })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        {...form.insert.getButtonProps({
          name: fields.tasks.name,
        })}
      >
        Add task
      </button>

      <button>Save</button>
    </form>
  );
}
