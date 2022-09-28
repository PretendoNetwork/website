<template>
  <div>
    <Container>
      <SubHeading>Game servers</SubHeading>
      <Heading class="-mt-4" dot>Recreated</Heading>
      <Paragraph class="max-w-md my-4">
        Pretendo is a free and open source replacement for Nintendo's servers
        for both the 3DS and Wii U, allowing online connectivity for all, even
        after the original servers are discontinued
      </Paragraph>
      <div class="flex items-start space-x-3">
        <Button>Read more</Button>
      </div>
    </Container>
  </div>
</template>

<script setup>
import Button from '@/components/ui/buttons/Button.vue';
import Container from '@/components/layout/Container.vue';
import SubHeading from '@/components/type/SubHeading.vue';
import Heading from '@/components/type/Heading.vue';
import Paragraph from '@/components/type/Paragraph.vue';
</script>
