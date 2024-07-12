<script lang="ts">
    export let message: string;
    export let type: string;

    const getIcon = (arg: string) => {
        switch (arg) {
            case "success":
                return "check";
            case "warning":
                return "warning";
            case "error":
                return "error";
            default:
                return "notifications";
        }
    };
</script>

<div class="wrapper flex justify-center p-4">
    <div class="flex min-w-[5rem] rounded-xl border-2 bg-white p-2 px-4">
        <div class="icon mr-2">
            <span class="material-symbols-rounded text-base">
                {getIcon(type)}
            </span>
        </div>
        <div class="text">
            {message}
        </div>
    </div>
</div>
