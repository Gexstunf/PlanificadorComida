import { supabase } from '../lib/supabaseClient'

export async function uploadRecipeImage(file, userId) {
    const ext      = file.name.split('.').pop()
    const filename = `${userId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
        .from('recipe-images')
        .upload(filename, file, { upsert: true })

    if (error) throw error

    const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filename)

    return data.publicUrl
}