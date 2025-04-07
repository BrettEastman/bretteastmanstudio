<script lang="ts">
</script>

<div class="flex flex-col items-center px-8 py-4">
  <h1 class="text-2xl text-primary10 dark:text-primary80 font-semibold py-8">
    Home Page
  </h1>
  <div
    class="text-md text-primary10 dark:text-primary80 sm:text-lg md:w-3/4 lg:w-1/2"
  >
    <p>
      Hello, I am Brett, a{" "}
      <a href="https://www.bretteastman.dev/" target="_blank" class="text-links"
        >software engineer,
      </a>
      {" "}<a
        href="https://www.brettaustineastman.com/selected_works"
        target="_blank"
        class="text-links"
      >
        composer,
      </a>
      {" "}
      <a
        href="https://www.brettaustineastman.com/about"
        target="_blank"
        class="text-links"
      >
        musician,
      </a> and former music teacher based in San Francisco. As a teacher, my mission
      was to provide students the chance to develop lasting musical skills, leaving
      them with the ability to continue to provide for themselves a lifetime of musical
      enjoyment. My aim was to inspire students to be curious, to do their very best
      and to find their own deep connection to music.
    </p>
    <br />
    <p>
      This archive contains teaching materials I’ve created or adapted for
      students over the years. These resources were either useful for teaching
      music concepts or specifically requested by students. Most songs were
      transcribed by me, although some are based on others’ charts or tabs found
      online, which I then modified. All PDFs are free to download.
    </p>
    <br />
    <p>
      While you are here browsing, you might also want to chat with an <a
        href="/chat"
        class="text-links"
      >
        AI music historian
      </a> who loves to give recommendations of artists, albums, and songs to listen
      to. You can ask about any music history topic, or find out more about the background
      of a song, artist, or album, and the AI will do its best to provide an informative
      response. And it may even give you a recommendation or two! Please log in to
      use the chat feature.
    </p>
    <br />
    <p>
      And for the drummers out there, you may also be interested in purchasing
      my drum book,
      <a
        href="https://www.amazon.com/gp/product/B09QGB3TM3?ref_=dbs_m_mng_rwt_calw_tpbk_0&storeType=ebooks&qid=1731269493&sr=8-1"
        target="_blank"
        aria-label="Patterns and Beats on Amazon"
        class="text-links">Patterns and Beats</a
      >, which is intended for beginner to intermediate level students. It is a
      very useful reference and guide, which contains collections of linear
      patterns and a curated selection of drum beats, arranged in logical order
      of difficulty. The layout was designed for readability, clarity and
      comfort. It is available on paperback and e-book.
    </p>
    <a
      href="https://www.amazon.com/gp/product/B09QGB3TM3?ref_=dbs_m_mng_rwt_calw_tpbk_0&storeType=ebooks&qid=1731269493&sr=8-1"
      target="_blank"
      aria-label="Patterns and Beats on Amazon"
      class="grid place-items-center my-8"
    >
      <img
        src="/images/Patterns-and-Beats4.jpg"
        alt="Patterns and Beats front cover"
        class="w-full md:w-3/4 lg:w-1/2 rounded-lg hover:scale-105 duration-500"
      />
    </a>
  </div>
</div>

<style>
  .text-links {
    border-bottom: solid 1px;
    border-color: var(--secondary10);
    transition-duration: 200ms;
  }
  .text-links:hover {
    color: var(--secondary60);
    border-color: transparent;
    transition-duration: 200ms;
  }
  @media (prefers-color-scheme: dark) {
    .text-links {
      border-color: var(--secondary80);
    }
  }
</style>
