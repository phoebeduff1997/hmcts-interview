package org.interview.hmcts.controllers;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

public class Urls
{
	public static final String ROOT = "/api";

	@NoArgsConstructor(access = AccessLevel.PRIVATE)
	public static final class Task
	{
		public static final String BASE = ROOT + "/task";

		@NoArgsConstructor(access = AccessLevel.PRIVATE)
		public static final class Get
		{
			public static final String GET_ALL_TASKS = BASE;
			public static final String GET_TASK = BASE + "/{id}";
			public static final String GET_ALL_RECENTLY_OVERDUE_TASKS = BASE + "/overdue";
		}

		@NoArgsConstructor(access = AccessLevel.PRIVATE)
		public static final class Post
		{
			public static final String CREATE_TASK = BASE;
		}

		@NoArgsConstructor(access = AccessLevel.PRIVATE)
		public static final class Patch
		{
			public static final String UPDATE_STATUS = BASE + "/status";
		}

		@NoArgsConstructor(access = AccessLevel.PRIVATE)
		public static final class Delete
		{
			public static final String DELETE_TASK = BASE + "/{id}";
		}
	}
}
