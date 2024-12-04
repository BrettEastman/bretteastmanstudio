<script lang="ts">
  export let isActive: boolean = false;
</script>

<div class:active={isActive} class="hamburger">
  <span class="line"></span>
  <span class="line"></span>
  <span class="line"></span>
</div>

<style>
  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 40px;
    height: 30px;
    cursor: pointer;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .line {
    width: 100%;
    height: 3px;
    background-color: var(--primary30);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .active .line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 9px);
  }

  .active .line:nth-child(2) {
    opacity: 0;
  }

  .active .line:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -9px);
  }
</style>
