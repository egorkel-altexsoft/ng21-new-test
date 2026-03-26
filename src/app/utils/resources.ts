import { computed, linkedSignal, type Signal } from '@angular/core';
import type { Resource, ResourceSnapshot } from '@angular/core';

type CustomResourceSnapshot<T> = Pick<ResourceSnapshot<T>, 'status'> & { error: Error | undefined; value: T };

export function resourceWithValue<T>(input: Resource<T>, initialValue: T): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, CustomResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      const { value: previousSnap } = previous ?? {};
      const previousValue = previousSnap?.value ?? initialValue;
      const currentValue = snap.status !== 'error' ? (snap.value ?? initialValue) : previousValue;
      const error = snap.status === 'error' ? snap.error : undefined;
      return { status: snap.status, value: currentValue, error };
    }
  });
  return wrapResource(derived);
}

function wrapResource<T>(input: Signal<CustomResourceSnapshot<T>>): Resource<T> {
  const isValueDefined = computed(() => input().status !== 'error' && input().value !== undefined);

  // `Resource<T>.hasValue` is a type-guard overload so TS can narrow `T`.
  function hasValue(this: T extends undefined ? Resource<T> : never): this is Resource<Exclude<T, undefined>>;
  function hasValue(): boolean;
  function hasValue(this: unknown) {
    return isValueDefined();
  }

  return {
    error: computed(() => input().error),
    hasValue,
    isLoading: computed(() => input().status === 'loading'),
    snapshot: computed(() => {
      const { status, error, value } = input();
      if (status === 'error') {
        return { status: 'error', error: error as Error };
      }
      return { status, value };
    }),
    status: computed(() => input().status),
    value: computed(() => input().value)
  } as const satisfies Resource<T>;
}
