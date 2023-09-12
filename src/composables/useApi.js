import useSupabase from 'src/boot/supabase'
import useAuthUser from './useAuthUser'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default function useApi() {
  const { supabase } = useSupabase()
  const { user } = useAuthUser()
  const route = useRoute()
  const $q = useQuasar()

  const fetchPaginatedData = async (table, userId, page, pageSize) => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq('userId', userId)
      .range(page * pageSize, (page + 1) * pageSize - 1)
      .order('created_at', { ascending: false }); // Thay thế bằng tên cột bạn muốn sắp xếp

    if (error) {
      throw error;
    }
    return data;
  }


  const fetchListData = async (table, userId) => {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq('userId', userId)
      .order('created_at', { ascending: false }); // Thay thế bằng tên cột bạn muốn sắp xếp

    if (error) {
      throw error;
    }
    return data;
  }

  const removeById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ id: id });

    if (error) throw error
    return data;
  }

  const getById = async (table, id, userId) => {
    const { data, error } = await supabase
      .from(table)
      .select(`
      id,
      userId,
      price,
      date,
      description,
    categories (
      id,
      name,
      type
    )
  `)
      .match({ id: id, userId: userId })
      .limit(1)
      .single();
    if (error) throw error

    return data
  }

  const updateById = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ id: form.id })
    if (error) throw error
    return data
  }

  function generateRandomColorArray(length) {
    const colorArray = [];

    // Hàm này tạo một mã màu ngẫu nhiên
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // Tạo mảng các mã màu ngẫu nhiên
    for (let i = 0; i < length; i++) {
      const randomColor = getRandomColor();
      colorArray.push(randomColor);
    }

    return colorArray;
  }

  return {
    generateRandomColorArray,
    fetchPaginatedData,
    getById,
    removeById,
    fetchListData,
  }
}
