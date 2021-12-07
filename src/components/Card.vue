<template>
    <div class="flex justify-center">
        <h1 class="text-white bg-red-300 inline-block rounded-md p-4 font-bold text-xl lg:text-3xl text-center">
            <slot></slot>
        </h1>
    </div>
</template>


<script>
export default {
    name: 'Card'
}
</script>