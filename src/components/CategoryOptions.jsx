import { categories } from "../utils/categories";

const CategoryOptions = () => (
  <>
    <option value="">Selecione Categoria</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </>
);

export default CategoryOptions;