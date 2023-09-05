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

    const removeById = async (table, id) => {
      const { data, error } = await supabase
      .from(table)
      .delete()
      .match({id: id});

      if(error) throw error
      return data;
    }

    const getById = async (table, id) => {
      const { data, error } = await supabase
      .from(table)
      .select()
      .eq('id', id);
      if (error) throw error

      return data[0]
    }

    return {
        fetchPaginatedData,
        getById,
        removeById,
    }
}
