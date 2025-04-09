<script lang="ts">
  import { page } from "$app/stores";

  interface Props {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  }

  let {
    title = "Brett Eastman - Full Stack Developer",
    description = "Brett Austin Eastman is a Full Stack software engineer, musician, composer, and former music teacher based in San Francisco.",
    keywords = "software development, web development, developer, music, web design, guitar tabs, music theory, music history, AI music historian",
    ogImage = "/images/Brett-headshot.jpg",
  }: Props = $props();

  let fullUrl = $derived($page.url.href);
  let fullImageUrl = $derived(new URL(ogImage, $page.url.origin).href);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />

  <meta property="og:url" content={fullUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={fullImageUrl} />
  <meta property="og:image:type" content="image/jpeg" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={fullImageUrl} />
</svelte:head>
