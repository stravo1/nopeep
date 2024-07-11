<script lang="ts">
  import Spinner from "./Spinner.svelte";
  import { modalMessage, modalVisible } from "../store/store";
  import { onDestroy } from "svelte";

  let visible: boolean;
  const unsubscribe = modalVisible.subscribe((val) => {
    visible = val;
  });
  onDestroy(unsubscribe);
</script>

<div
  class="modal fixed top-0 z-50 box-border hidden h-screen w-screen"
  class:visible
/>
<div
  class="wrapper fixed top-0 z-50 box-border hidden h-screen w-screen bg-white"
  class:visible
>
  <div
    class="loadingCard mx-auto my-[45vh] box-border flex h-[6rem] w-[25vw] min-w-[15rem] items-center justify-center gap-4 rounded-xl font-medium text-zinc-900"
  >
    <Spinner /> &ensp; {$modalMessage}
  </div>
</div>

<style>
  .visible {
    display: block !important;
  }
</style>
